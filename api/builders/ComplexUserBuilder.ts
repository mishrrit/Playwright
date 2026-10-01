export class ComplexUserBuilder {
  private payload: any = { profile: {}, addresses: [], preferences: {} };

  setEmail(email: string) {
    this.payload.profile.email = email;
    return this;
  }
  setName(first: string, last: string) {
    this.payload.profile.name = { first, last };
    return this;
  }
  addAddress(addr: { line1: string; city: string; country: string }) {
    this.payload.addresses.push(addr);
    return this;
  }
  setPreferences(pref: Record<string, any>) {
    this.payload.preferences = pref;
    return this;
  }
  build() {
    return this.payload;
  }
}
