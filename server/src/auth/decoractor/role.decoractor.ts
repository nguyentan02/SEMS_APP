import { SetMetadata } from "@nestjs/common";
import { USER_TYPES } from "../../global/globalEnum";

export const Roles = (...roles: USER_TYPES[]) => SetMetadata('roles', roles)