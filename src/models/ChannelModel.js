import Parse from 'parse'



let IS_CHANNEL = 'is_channel'
let PARTICIPANTS = 'participants'
let NAME = 'name'
let HISTORY = 'history'
let HISTORY_MESSAGE = 'message'
let HISTORY_SENT_AT = 'sent_at'
let HISTORY_SENT_BY = 'sent_by'
let ID = '_id'


export class ChannelModel extends Parse.Object {


    constructor() {
        super('Channel')

        this.isChannel = false
        this.set(IS_CHANNEL, this.isChannel)

        this.participants = []
        this.set(PARTICIPANTS, this.participants)


        this.name = 'NewChannel'
        this.set(NAME, this.name)


        this.history = [] // Array of maps
        this.set(HISTORY, this.history)
    }


    getHistory() {
        return this.get(HISTORY)
    }


    getName() {
        return this.get(NAME)
    }


    getParticipants() {
        return this.get(PARTICIPANTS)
    }

    getIsChannel() {
        return this.get(IS_CHANNEL)
    }


    setIsChannel(isGroup, sucessHandler, errorHandler) {
        this.set(IS_CHANNEL, isGroup)
        return saveData(this, sucessHandler, errorHandler)
    }

    addParticipant(user, successHandler, errorHandler) {
        var particpants = this.get(PARTICIPANTS)
        participants.add(user);
        this.set(PARTICIPANTS, particpants)
        return saveData(this, sucessHandler, errorHandler)
    }

    removeParticipantByIndex(index, successHandler, errorHandler) {
        var particpants = this.get(PARTICIPANTS)
        participants.splice(index, 0)
        this.set(PARTICIPANTS, particpants)
        return saveData(this, sucessHandler, errorHandler)
    }


    removeParticipantByUser(user, successHandler, errorHandler) {
        var particpants = this.get(PARTICIPANTS)

        participants.filter(function(participant, index, arr) {
            //Change to UserModel.ID
            var participantId = pariticipant.get(ID)
            var userId = user.get(ID)

            return participantId != userId
        })
        this.set(PARTICIPANTS, particpants)
        return saveData(this, successHandler, errorHandler)
    }

    updateName(newName, successHandler, errorHandler) {
        this.set(NAME, newName)
        return saveData(this, successHandler, errorHandler)

    }


    addToHistory(message) {
        var history = this.get(HISTORY)
        history.push(message)
        this.set(HISTORY, history)
      return  saveData(this, successHandler, errorHandler)
    }




}



saveData(pfobject, successHandler, errorHandler) {
    if (successHandler == null || successHandler == undefined) {
        successHandler = this.defaultSuccessHandler
    }

    if (errorHandler == null || errorHandler == undefined) {
        errorHandler = this.defaultErrorHandler
    }

    reuturn pfobject.save()
}


Parse.Object.registerSubclass('Channel', ChannelModel);
