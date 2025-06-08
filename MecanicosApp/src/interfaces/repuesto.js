import PropTypes from 'prop-types';

export const Repuesto = PropTypes.shape ({
    ID_Repuesto : PropTypes.number.isRequired, 
    Descripcion : PropTypes.string.isRequired,
    Cantidad : PropTypes.number.isRequired,
    Tipo : PropTypes.string.isRequired
})
 
