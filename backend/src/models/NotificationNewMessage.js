import mongoose from  "mongoose";

const NotificationNewMessageSchema = new mongoose.Schema({
   newMessage:{
    from:{type:String},
    to:{type:String}
   },
   receiverNotifcation:{
    type:Boolean,
    default:false
   },

})

const NotificationNewMessage = mongoose.model("NotificationMessage",NotificationNewMessageSchema)
export default NotificationNewMessage