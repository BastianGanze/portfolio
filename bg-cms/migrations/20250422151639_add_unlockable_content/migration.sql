-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "unlockContent" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
ADD COLUMN     "unlockContentGerman" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]';
