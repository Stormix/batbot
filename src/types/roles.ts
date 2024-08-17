// TODO: move to shared package
export enum Role {
  User,
  Follower,
  Subscriber,
  Moderator,
  Editor,
  Owner
}

export const RoleLabels = {
  [Role.User]: 'User',
  [Role.Follower]: 'Follower',
  [Role.Subscriber]: 'Subscriber',
  [Role.Moderator]: 'Moderator',
  [Role.Editor]: 'Editor',
  [Role.Owner]: 'Owner'
};
