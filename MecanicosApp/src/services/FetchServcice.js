export class FetchService {
    BASE_URL = 'http://10.0.2.2:3000/api/'
    //10.0.2.2 es la ip del emulador de Android que esta mapeada a la ip de nuestra computadora.
   
    async get(url) {
        try {
           const response = await fetch(`${this.BASE_URL}${url}`);
            if (!response.ok) {
                throw new Error("No se pudo hacer el fetch de manera correcta.");
            } else {
                 const data = await response.json();
                 return data;
            }
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async getByID(url, id) {
        try {
           const response = await fetch(`${this.BASE_URL}${url}/${id}`);
            if (!response.ok) {
                throw new Error("No se pudo hacer el fetch de manera correcta.");
            } else {
                 const data = await response.json();
                 return data;
            }
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    async put(url, body, id) {
        try {
           const response = await fetch(`${this.BASE_URL}${url}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'PUT',
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error("No se pudo hacer el fetch de manera correcta.");
            } else {
                 const data = await response.json();
                 return data;
            }
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
   
    async post(url, body) {
        try {
           const response = await fetch(`${this.BASE_URL}${url}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'POST',
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error("No se pudo hacer el fetch de manera correcta.");
            } else {
                 const data = await response.json();
                 return data;
            }
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
}