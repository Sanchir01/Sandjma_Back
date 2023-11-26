/*
  Warnings:

  - You are about to drop the column `image` on the `Color` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imageCss]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageCss` to the `Color` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Color_image_key";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "image",
ADD COLUMN     "imageCss" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Color_imageCss_key" ON "Color"("imageCss");
