-- DropForeignKey
ALTER TABLE "VisitActivity" DROP CONSTRAINT "VisitActivity_visitId_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "visitId" INTEGER;

-- MigrateData: copy visitId from VisitActivity into Activity (take the first visit per activity)
UPDATE "Activity" a
SET "visitId" = va."visitId"
FROM (
  SELECT DISTINCT ON ("activityId") "activityId", "visitId"
  FROM "VisitActivity"
  ORDER BY "activityId", "visitId"
) va
WHERE a."id" = va."activityId";

-- DropTable
DROP TABLE "VisitActivity";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
