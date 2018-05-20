import Parse from 'parse'



class ChannelModel extends Parse.Object {

    className (){
      return 'Channel'
    }


    constructor(){
      super(className())


      this.isChannel = false
      this.participants = []
      this.name = 'NewChannel'
      this.history = [] // Array of maps
    }


//// TODO: Implement
    setIsChannel(isGroup){
      this.isChannel = isGroup
    }
//TODO: Implement
    addParticipant(user){
      this.participants.append(user)
    }

    updateName(newName){
      this.name = newName
    }


    addToHistory(message){
      this.history.append(message)
    }



}
