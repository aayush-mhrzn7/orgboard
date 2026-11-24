export function apiError(message: string, code: string) {
  return { message, code };
}

export function authSuccess(
  message: string,
  accessToken?: string,
  user?: { id: string; name: string; email: string } | null,
) {
  return { message, accessToken: accessToken ?? null, user: user ?? null };
}

export function messageSuccess(message: string) {
  return { message };
}

export function userSuccess(
  message: string,
  user: { id: string; name: string; email: string },
) {
  return { message, user };
}

export function organizationSuccess(
  message: string,
  organization: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  },
) {
  return { message, organization };
}

export function postSuccess(
  message: string,
  post: {
    id: string;
    title: string;
    content: string;
    authorId: string | null;
    organizationId: string | null;
    createdAt: string;
    updatedAt: string;
  },
) {
  return { message, post };
}

export function tagSuccess(
  message: string,
  tag: { id: string; name: string; createdAt: string; updatedAt: string },
) {
  return { message, tag };
}

export function membershipSuccess(message: string, success = true) {
  return { message, success };
}
