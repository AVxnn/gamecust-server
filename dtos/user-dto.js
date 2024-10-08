export default class UserDto {
  email;
  id;
  isActivation;
  level;
  username;
  website;
  private;
  description;
  subscribers;
  iconActive;
  icons;
  subscriptions;
  roles;
  avatarPath;
  bgPath;

  constructor(model) {
    this.username = model.username;
    this.website = model.website;
    this.email = model.email;
    this.description = model.description;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.level = model.rating;
    this.subscribers = model.subscribers;
    this.subscriptions = model.subscriptions;
    this.private = model.private;
    this.iconActive = model.iconActive;
    this.icons = model.icons;
    this.roles = model.roles;
    this.avatarPath = model.avatarPath;
    this.bgPath = model.bgPath;
  }
}
