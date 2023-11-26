/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ProductColor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ProductColor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductColor_name_key" ON "ProductColor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductColor_slug_key" ON "ProductColor"("slug");
