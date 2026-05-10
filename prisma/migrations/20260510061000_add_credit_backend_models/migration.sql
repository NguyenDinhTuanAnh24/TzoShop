/*
  Warnings:

  - A unique constraint covering the columns `[orderCode]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiFamily` to the `ApiKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderCode` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreditLedgerType" AS ENUM ('PURCHASE', 'USAGE', 'REFUND', 'ADJUSTMENT', 'EXPIRE');

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "apiFamily" "ApiFamily" NOT NULL,
ADD COLUMN     "creditBucketId" TEXT,
ADD COLUMN     "revokedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "CreditBucket" ADD COLUMN     "apiKeyLimit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "orderCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "apiKeyLimit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'Mini';

-- AlterTable
ALTER TABLE "UsageLog" ADD COLUMN     "creditBucketId" TEXT;

-- CreateTable
CREATE TABLE "CreditLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creditBucketId" TEXT,
    "apiFamily" "ApiFamily" NOT NULL,
    "type" "CreditLedgerType" NOT NULL,
    "amount" BIGINT NOT NULL,
    "balanceAfter" BIGINT NOT NULL,
    "reason" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditLedger_userId_idx" ON "CreditLedger"("userId");

-- CreateIndex
CREATE INDEX "CreditLedger_creditBucketId_idx" ON "CreditLedger"("creditBucketId");

-- CreateIndex
CREATE INDEX "CreditLedger_apiFamily_idx" ON "CreditLedger"("apiFamily");

-- CreateIndex
CREATE INDEX "CreditLedger_type_idx" ON "CreditLedger"("type");

-- CreateIndex
CREATE INDEX "CreditLedger_createdAt_idx" ON "CreditLedger"("createdAt");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE INDEX "ApiKey_creditBucketId_idx" ON "ApiKey"("creditBucketId");

-- CreateIndex
CREATE INDEX "ApiKey_apiFamily_idx" ON "ApiKey"("apiFamily");

-- CreateIndex
CREATE INDEX "ApiKey_isActive_idx" ON "ApiKey"("isActive");

-- CreateIndex
CREATE INDEX "CreditBucket_userId_idx" ON "CreditBucket"("userId");

-- CreateIndex
CREATE INDEX "CreditBucket_productId_idx" ON "CreditBucket"("productId");

-- CreateIndex
CREATE INDEX "CreditBucket_apiFamily_idx" ON "CreditBucket"("apiFamily");

-- CreateIndex
CREATE INDEX "CreditBucket_isActive_idx" ON "CreditBucket"("isActive");

-- CreateIndex
CREATE INDEX "CreditBucket_expiresAt_idx" ON "CreditBucket"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderCode_key" ON "Order"("orderCode");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_productId_idx" ON "Order"("productId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Product_apiFamily_idx" ON "Product"("apiFamily");

-- CreateIndex
CREATE INDEX "Product_tier_idx" ON "Product"("tier");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX "UsageLog_userId_idx" ON "UsageLog"("userId");

-- CreateIndex
CREATE INDEX "UsageLog_apiKeyId_idx" ON "UsageLog"("apiKeyId");

-- CreateIndex
CREATE INDEX "UsageLog_creditBucketId_idx" ON "UsageLog"("creditBucketId");

-- CreateIndex
CREATE INDEX "UsageLog_apiFamily_idx" ON "UsageLog"("apiFamily");

-- CreateIndex
CREATE INDEX "UsageLog_status_idx" ON "UsageLog"("status");

-- CreateIndex
CREATE INDEX "UsageLog_createdAt_idx" ON "UsageLog"("createdAt");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_creditBucketId_fkey" FOREIGN KEY ("creditBucketId") REFERENCES "CreditBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_creditBucketId_fkey" FOREIGN KEY ("creditBucketId") REFERENCES "CreditBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditLedger" ADD CONSTRAINT "CreditLedger_creditBucketId_fkey" FOREIGN KEY ("creditBucketId") REFERENCES "CreditBucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
