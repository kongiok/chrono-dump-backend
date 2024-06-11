
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]{8,}$/;
  return passwordRegex.test(password);
}

export const parseScopes = (scopeString) => {
  const scopes = {};

  // 分割 scopeString 字串,以空白作為分隔符
  const scopeList = scopeString.split(' ');

  // 遍歷每個 scope
  for (const scope of scopeList) {
    const [resource, action] = scope.split(':');
    scopes[resource] = action;
  }

  return scopes;
}
