-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('APPROVED', 'PENDING', 'INACTIVE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT E'avatars/default.png';

-- CreateTable
CREATE TABLE "resources" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "status" "ResourceStatus" NOT NULL DEFAULT E'PENDING',
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
