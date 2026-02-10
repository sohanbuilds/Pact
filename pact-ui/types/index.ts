export enum TaskType {
  PERSONAL = 'PERSONAL',
  PRIVATE = 'PRIVATE',
  SHARED = 'SHARED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}

export enum Role {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  deadline?: string;
  type: TaskType;
  ownerId: string;
  assigneeId?: string;
  groupId?: string;
  createdAt: string;
  owner?: User;
  assignee?: User;
  group?: Group;
}

export interface Friendship {
  id: string;
  requesterId: string;
  receiverId: string;
  status: FriendshipStatus;
  createdAt: string;
  requester?: User;
  receiver?: User;
}

export interface Group {
  id: string;
  name: string;
  createdAt: string;
  members?: GroupMember[];
  tasks?: Task[];
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: Role;
  user?: User;
  group?: Group;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
}

export interface CreatePrivateTaskDto extends CreateTaskDto {
  assigneeId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  deadline?: string;
  completed?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface DashboardStats {
  personal: number;
  private: number;
  shared: number;
}

