-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentGerman" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
ADD COLUMN     "titleGerman" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "titleGerman" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "shortDescription" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "content" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "shortDescriptionGerman" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "contentGerman" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Project_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Project_tags_AB_unique" ON "_Project_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Project_tags_B_index" ON "_Project_tags"("B");

-- AddForeignKey
ALTER TABLE "_Project_tags" ADD CONSTRAINT "_Project_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Project_tags" ADD CONSTRAINT "_Project_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
