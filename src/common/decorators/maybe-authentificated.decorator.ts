import { SetMetadata } from "@nestjs/common";

export const MaybeAuthentificated = () => SetMetadata("isMaybeAuthentificated", true);