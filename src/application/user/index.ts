import { User } from "./dto"

module.exports.postUser = async (event: User) => {

    console.log(event)
    return event
}