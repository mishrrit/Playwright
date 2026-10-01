import { faker } from "@faker-js/faker";

export const fakeUser = () => ({
  email: faker.internet.email(),
  fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
  password: faker.internet.password(12),
});
