 class CustomerrorHandler  extends Error
{
    
    constructor (status,msg)
    {
        super(); 
        this.status =status;
        this.message=msg;
    
    }

    static alreadyExist (message)
    {
        return new CustomerrorHandler(409,message);
     
    }
    static wrondCridentiales (message='Invalid user')
    {
        return new CustomerrorHandler(401,message);
     
    }
    static unAuthorized(message='unauthorized')
    {
        return new CustomerrorHandler(401,message);
     
    }
    static DoseNotExist(message='404 Not Found')
    {
        return new CustomerrorHandler(404,message);
     
    }
    static servererror(message='internal server error')
    {
        return new CustomerrorHandler(500,message);
     
    }
}

export default CustomerrorHandler;