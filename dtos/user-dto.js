export default class UserDto {
    email;
    id;
    isActivation;
    level;
    username;

    constructor(model) {
        this.username = model.username
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.level = model.rating;
        this.subscribers = model.subscribers;
        this.subscriptions = model.subscriptions;
    }
}