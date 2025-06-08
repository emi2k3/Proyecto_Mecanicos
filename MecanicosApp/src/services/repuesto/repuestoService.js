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

   async putRepuesto(id,body)
   {
    try {
        
        await this.Servicio.put('repuestos',body,id);
                
    } catch (error) {
        console.error(error);

    }
    
   }
}