import { FetchService } from "../FetchServcice";

export class repuestoService
{
    constructor()
    {
        this.Servicio = new FetchService();
    }

   async getAllRepuestos()
   {
    try {
        
       const response = await this.Servicio.get('repuestos');
  
        return response.message;
                
    } catch (error) {
        console.error(error);
        return [];
    }
    
   }
}