import Parse from 'parse'



export class ChannelModel extends Parse.Object {




  static let IS_CHANNEL  = 'is_channel'
  static let PARTICIPANTS = 'participants'
  static let NAME = 'name'
  static let HISTORY = 'history'
  static let HISTORY_MESSAGE = 'message'
  static let HISTORY_SENT_AT = 'sent_at'
  static let HISTORY_SENT_BY = 'sent_by'
  static let ID = '_id'




    className (){
      return 'Channel'
    }


    constructor(){
      super(className())

      this.isChannel = false
      this.set(ChannelModel.IS_CHANNEL, this.isChannel)

      this.participants = []
      this.set(ChannelModel.PARTICIPANTS, this.participants)


      this.name = 'NewChannel'
      this.set(ChannelModel.NAME, this.name)


      this.history = [] // Array of maps
      this.set(ChannelModel.HISTORY, this.history)
    }


    getHistory(){
      return this.get(ChannelModel.HISTORY)
    }


    getName(){
      return this.get(ChannelModel.NAME)
    }


    getParticipants(){
      return this.get(ChannelModel.PARTICIPANTS)
    }

    getIsChannel(){
      return this.get(ChannelModel.IS_CHANNEL)
    }


    setIsChannel(isGroup, sucessHandler, errorHandler){
      this.set(ChannelModel.IS_CHANNEL, isGroup)
      saveData(this, sucessHandler, errorHandler )
    }

    addParticipant(user,successHandler, errorHandler){
      var particpants = this.get(ChannelModel.PARTICIPANTS)
      participants.add(user);
      this.set(ChannelModel.PARTICIPANTS, particpants)
      saveData(this, sucessHandler, errorHandler)
    }

    removeParticipantByIndex(index,successHandler, errorHandler){
      var particpants = this.get(ChannelModel.PARTICIPANTS)
      participants.splice(index, 0)
      this.set(ChannelModel.PARTICIPANTS, particpants)
      saveData(this, sucessHandler, errorHandler)
    }


    removeParticipantByUser(user, successHandler, errorHandler){
      var particpants = this.get(ChannelModel.PARTICIPANTS)

      participants.filter(function(participant, index, arr){
        //Change to UserModel.ID
        var participantId = pariticipant.get(ChannelModel.ID)
        var userId = user.get(ChannelModel.ID)

        return participantId != userId
      })
      this.set(ChannelModel.PARTICIPANTS, particpants)
      saveData(this, successHandler, errorHandler)
    }

    updateName(newName, successHandler, errorHandler){
      this.set(ChannelModel.NAME, newName)
      saveData(this, successHandler, errorHandler)

    }


    addToHistory(message){
      var history = this.get(ChannelModel.HISTORY)
      history.push(message)
      this.set(ChannelModel.HISTORY, history)
      saveData(this, successHandler, errorHandler)
    }

}



saveData(pfobject, successHandler, errorHandler){
 if (successHandler == null || successHandler == undefined) {
   successHandler = this.defaultSuccessHandler
 }

 if (errorHandler == null || errorHandler == undefined){
   errorHandler = this.defaultErrorHandler
 }

 pfobject.save(null, {
   success: successHandler,
   error: errorHandler
 })
}
