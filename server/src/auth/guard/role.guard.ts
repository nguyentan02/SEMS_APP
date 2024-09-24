import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { USER_TYPES } from "../../global/globalEnum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<USER_TYPES[]>('roles', [
            context.getHandler(),
            context.getClass()
        ])
        if (!roles) return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user
        if (user.isBan) return false
        return roles.some(role => role == user.role)
    }
}