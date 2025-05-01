/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('PROGRAMMING', 'DESIGN', 'LIFESTYLE', 'TECH', 'PERSONAL');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_categoryId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "categoryId",
ADD COLUMN     "category" "CategoryName" NOT NULL;

-- DropTable
DROP TABLE "Category";
