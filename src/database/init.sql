-- Tabla: Turno
CREATE TABLE Turno (
    ID_Turno SERIAL PRIMARY KEY,
    Nombre VARCHAR(20) NOT NULL,
    CHECK (Nombre IN ('Mañana', 'Tarde', 'Noche'))
);

-- Tabla: Persona
CREATE TABLE Persona (
    ID_Persona SERIAL PRIMARY KEY,
    Documento VARCHAR(36) NOT NULL UNIQUE,
    Rol CHAR(1) NOT NULL,
    Nombre_Completo VARCHAR(36) NOT NULL
);

-- Tabla: Cliente
CREATE TABLE Cliente (
    ID_Cliente SERIAL PRIMARY KEY,
    ID_Persona INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (ID_Persona) REFERENCES Persona(ID_Persona) ON DELETE CASCADE
);

-- Tabla: Telefono
CREATE TABLE Telefono (
    ID_Telefono SERIAL PRIMARY KEY,
    ID_Persona INTEGER NOT NULL,
    Numero VARCHAR(20) NOT NULL UNIQUE,
    FOREIGN KEY (ID_Persona) REFERENCES Persona(ID_Persona) ON DELETE CASCADE
);

-- Tabla: Vehiculo
CREATE TABLE Vehiculo (
    ID_Vehiculo SERIAL PRIMARY KEY,
    Matricula VARCHAR(36) NOT NULL UNIQUE,
    Tipo VARCHAR(36) NOT NULL,
    Marca VARCHAR(36) NOT NULL,
    Modelo VARCHAR(36) NOT NULL,
    ID_Cliente INTEGER NOT NULL,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE
);

-- Tabla: Mecanico
CREATE TABLE Mecanico (
    ID_Mecanico SERIAL PRIMARY KEY,
    Especializacion VARCHAR(36) NOT NULL,
    ID_Turno INTEGER NOT NULL,
    ID_Persona INTEGER NOT NULL UNIQUE,
    Contrasena TEXT NOT NULL,
    FOREIGN KEY (ID_Turno) REFERENCES Turno(ID_Turno) ON DELETE CASCADE,
    FOREIGN KEY (ID_Persona) REFERENCES Persona(ID_Persona) ON DELETE CASCADE
);

-- Tabla: Repuesto
CREATE TABLE Repuesto (
    ID_Repuesto SERIAL PRIMARY KEY,
    Descripcion VARCHAR(36) NOT NULL,
    Cantidad INTEGER NOT NULL CHECK (Cantidad >= 0),
    Tipo VARCHAR(36) NOT NULL
);

-- Tabla: Reparacion
CREATE TABLE Reparacion (
    ID_Reparacion SERIAL PRIMARY KEY,
    Descripcion TEXT NOT NULL,
    Tiempo INTEGER CHECK (Tiempo > 0),
    ID_Vehiculo INTEGER NOT NULL,
    Estado BOOLEAN DEFAULT FALSE, 
    FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculo(ID_Vehiculo) ON DELETE CASCADE
);

-- Tabla: RepuestosReparacion
CREATE TABLE RepuestosReparacion (
    ID_Repuesto INTEGER NOT NULL,
    ID_Reparacion INTEGER NOT NULL,
	Cantidad_Usada INTEGER NOT NULL,
    PRIMARY KEY (ID_Repuesto, ID_Reparacion),
    FOREIGN KEY (ID_Repuesto) REFERENCES Repuesto(ID_Repuesto) ON DELETE CASCADE,
    FOREIGN KEY (ID_Reparacion) REFERENCES Reparacion(ID_Reparacion) ON DELETE CASCADE
);

-- Tabla: MecanicoRealizaReparacion
CREATE TABLE MecanicoRealizaReparacion (
    ID_Mecanico INTEGER NOT NULL,
    ID_Reparacion INTEGER NOT NULL,
    PRIMARY KEY (ID_Mecanico, ID_Reparacion),
    FOREIGN KEY (ID_Mecanico) REFERENCES Mecanico(ID_Mecanico) ON DELETE CASCADE,
    FOREIGN KEY (ID_Reparacion) REFERENCES Reparacion(ID_Reparacion) ON DELETE CASCADE
);

CREATE TABLE auditoria (
    ID_cambio SERIAL PRIMARY KEY,
    tabla varchar(30),
    usuario varchar(30),
    operacion varchar(30),
    fecha timestamp,
    id_modificado integer
);

-- Auditoria

CREATE OR REPLACE FUNCTION auditar_generico()
RETURNS trigger AS $$
DECLARE
    pk_column text;
    id_value integer;
BEGIN
    SELECT a.attname INTO pk_column --Guardamos el nombre de la primary key 
    FROM pg_index i --Buscamos en la tabla pg_index
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) -- Verificamos si la primary key es una columna de la tabla
    WHERE i.indrelid = TG_TABLE_NAME::regclass -- Verificamos si la tabla es la que queremos auditar
    AND i.indisprimary -- Verificamos si es una primary key 
    LIMIT 1; -- Limiteamos a 1  
    
    EXECUTE format('SELECT ($1).%I', pk_column) 
    INTO id_value
    USING CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;

    INSERT INTO auditoria (
        tabla,
        usuario,
        operacion,
        fecha,
        id_modificado
    )
    VALUES (
        TG_TABLE_NAME,
        current_user,
        TG_OP,
        now(),
        id_value
    );

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER auditoria_mecanico
    AFTER INSERT OR UPDATE OR DELETE ON Mecanico
    FOR EACH ROW EXECUTE FUNCTION auditar_generico();

CREATE TRIGGER auditoria_cliente
    AFTER INSERT OR UPDATE OR DELETE ON Cliente
    FOR EACH ROW EXECUTE FUNCTION auditar_generico();

CREATE TRIGGER auditoria_repuestosreparacion
    AFTER INSERT OR UPDATE OR DELETE ON RepuestosReparacion
    FOR EACH ROW EXECUTE FUNCTION auditar_generico();
    
CREATE OR REPLACE FUNCTION verificar_y_descontar_stock_repuesto()
RETURNS TRIGGER AS $$
DECLARE
    stock_actual INTEGER;
BEGIN
    SELECT Cantidad INTO stock_actual FROM Repuesto WHERE ID_Repuesto = NEW.ID_Repuesto;

    -- Validar que haya stock suficiente para la cantidad usada
    IF stock_actual < NEW.Cantidad_Usada THEN
        RAISE EXCEPTION 'No hay stock suficiente del repuesto %: disponible %, requerido %',
            NEW.ID_Repuesto, stock_actual, NEW.Cantidad_Usada;
    END IF;

    -- Descontar la cantidad usada del stock
    UPDATE Repuesto
    SET Cantidad = Cantidad - NEW.Cantidad_Usada
    WHERE ID_Repuesto = NEW.ID_Repuesto;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_verificar_y_descontar_stock_repuesto
BEFORE INSERT ON RepuestosReparacion
FOR EACH ROW
EXECUTE FUNCTION verificar_y_descontar_stock_repuesto();

-- Insertar Turnos (valores permitidos)
INSERT INTO Turno (Nombre) VALUES
('Mañana'),
('Tarde'),
('Noche');

-- Insertar Personas
INSERT INTO Persona (Documento, Nombre_Completo,Rol) VALUES
('12345678', 'Matías Pérez','2'),
('23456789', 'Laura Gómez','1'),
('34567890', 'Carlos Rodríguez','1'),
('45678901', 'Ana Fernández','2'),
('81218361', 'Laura Gómez','1'),
('95347871', 'Carlos Rodríguez','1'),
('45678901', 'Ana Fernández','2'),
('42749102', 'Emilio Marques','3');

-- Insertar Teléfonos
INSERT INTO Telefono (ID_Persona, Numero) VALUES
(1, '099123456'),
(2, '098234567'),
(3, '097345678'),
(4, '096456789');

-- Insertar Clientes (asociados a personas)
INSERT INTO Cliente (ID_Persona) VALUES
(2),
(3);

-- Insertar Vehículos
INSERT INTO Vehiculo (Matricula, Tipo, ID_Cliente, Marca, Modelo) VALUES
('ABC 1234', 'Camioneta', 1, 'Renault', 'KWID'),
('XYZ 7890', 'Auto', 2, 'Toyota', 'Crown Majesta 1996');

-- Insertar Mecánicos (asociados a personas y turnos)
-- ROL 1:CLIENTE  ROL 2:MECANICO  ROL 3:JEFE DE TALLER
INSERT INTO Mecanico (Especializacion, ID_Turno, ID_Persona, Contrasena) VALUES
('Motores', 1, 1, '$2b$10$Z2aNMZ3zAcDJOyebAguArOw.rqQ4oievmjbFGocWwBtxMLpg4dUCC'), -- Matias Pérez, contraseña sin encriptar (password123)
('Frenos', 2, 4, '$2b$10$IiGyD39n4g1IRD3Kc3KDJu4QTJTRBKl.C9vfDDIEEdbh1Uzi1DurK'), -- Ana Fernández, contraseña sin encriptar (securepass456)
('Todo', 2, 5, '$2a$10$muIi3spSIPc5HCXP39irvepsaPgYbE4gEqadsoz39kt5f9kVFygQy'); -- Emi Marques, contraseña sin encriptar (contra123)


-- Insertar Repuestos
INSERT INTO Repuesto (Descripcion, Cantidad, Tipo) VALUES
('Filtro de aceite', 10, 'Motor'),
('Pastilla de freno', 5, 'Frenos'),
('Bujía', 20, 'Encendido');

-- Insertar Reparaciones
INSERT INTO Reparacion (Descripcion, ID_Vehiculo) VALUES
('Cambio de filtro', 1),
('Reemplazo de pastillas de freno', 2),
('Cambio de chip', 1);

-- Relación Mecánico - Reparación
INSERT INTO MecanicoRealizaReparacion (ID_Mecanico, ID_Reparacion) VALUES
(1, 1),  -- Matías realiza cambio de filtro
(2, 2);  -- Ana realiza reemplazo de pastillas

-- Repuestos usados en reparaciones
INSERT INTO RepuestosReparacion (ID_Repuesto, ID_Reparacion, Cantidad_Usada) VALUES
(1, 1, 1),  -- 1 Filtro para reparación 1
(2, 2, 2);  -- 2 Pastillas para reparación 2

