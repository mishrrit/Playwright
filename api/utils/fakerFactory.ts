function randomString(len = 8) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + len);
}

export const fakeUser = () => ({
  email: `user.${randomString(6)}@example.com`,
  fullName: `User ${randomString(6)}`,
  password: randomString(12),
});
