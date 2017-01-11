export class SharedResources {
  constructor() {
    this.currentUser = {
      isLogedIn: false,
      isAdmin: false,
      id: -1,
      name: "",
      email: ""
    };
  }
}