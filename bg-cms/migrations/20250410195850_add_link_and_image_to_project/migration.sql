-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "link" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "mainImage_extension" TEXT,
ADD COLUMN     "mainImage_filesize" INTEGER,
ADD COLUMN     "mainImage_height" INTEGER,
ADD COLUMN     "mainImage_id" TEXT,
ADD COLUMN     "mainImage_width" INTEGER;
