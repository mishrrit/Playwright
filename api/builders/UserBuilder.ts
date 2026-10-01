import { UserDTO } from "../models/User";

export class UserBuilder {
  private user: Partial<UserDTO> = {};

  withEmail(email: string) {
    this.user.email = email;
    return this;
  }
  withPassword(password: string) {
    this.user.password = password;
    return this;
  }
  withFullName(name: string) {
    this.user.fullName = name;
    return this;
  }
  withRole(role: string) {
    this.user.role = role;
    return this;
  }
  build(): UserDTO {
    if (!this.user.email) throw new Error("email required");
    return this.user as UserDTO;
  }
}
