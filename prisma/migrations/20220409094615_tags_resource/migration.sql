-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT E'default.png';
