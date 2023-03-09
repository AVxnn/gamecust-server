export default class UserDto {
    email;
    id;
    isActivation;
    rating;
    username;

    constructor(model) {
        this.username = model.username
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.rating = model.rating;
    }
}