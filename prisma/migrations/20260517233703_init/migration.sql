-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "rowCount" INTEGER NOT NULL,
    "columnCount" INTEGER NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
