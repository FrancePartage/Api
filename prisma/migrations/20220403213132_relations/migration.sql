-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('FAMILY', 'FRIEND', 'WORKMATE', 'SPOUSE');

-- CreateTable
CREATE TABLE "relations" (
    "id" SERIAL NOT NULL,
    "requestToId" INTEGER NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_relations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_relations_AB_unique" ON "_relations"("A", "B");

-- CreateIndex
CREATE INDEX "_relations_B_index" ON "_relations"("B");

-- AddForeignKey
ALTER TABLE "relations" ADD CONSTRAINT "relations_requestToId_fkey" FOREIGN KEY ("requestToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_relations" ADD FOREIGN KEY ("A") REFERENCES "relations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_relations" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
