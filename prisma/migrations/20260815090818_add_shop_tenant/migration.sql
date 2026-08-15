/*
  Tenant migration:
  - Create default shop first
  - Move existing data to that shop
  - Then make shopId required
*/

-- =========================================================
-- 1. CREATE SHOP
-- =========================================================

CREATE TYPE "ShopUserRole" AS ENUM ('CUSTOMER', 'ADMIN');

CREATE TABLE "shops" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "shops_shopId_key"
ON "shops"("shopId");

CREATE INDEX "shops_isActive_idx"
ON "shops"("isActive");


-- =========================================================
-- 2. CREATE DEFAULT SHOP FOR EXISTING DATA
-- =========================================================

INSERT INTO "shops" (
    "id",
    "shopId",
    "name",
    "isActive",
    "createdAt",
    "updatedAt"
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'SHOP001',
    'Mahadev Packaging',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. CREATE SHOP_USERS
-- =========================================================

CREATE TABLE "shop_users" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ShopUserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_users_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "shop_users_shopId_idx"
ON "shop_users"("shopId");

CREATE INDEX "shop_users_userId_idx"
ON "shop_users"("userId");

CREATE UNIQUE INDEX "shop_users_shopId_userId_key"
ON "shop_users"("shopId", "userId");


-- =========================================================
-- 4. ADD SHOP ID TO CUSTOMERS
-- =========================================================

ALTER TABLE "Customer"
ADD COLUMN "shopId" TEXT;

ALTER TABLE "Customer"
ADD COLUMN "userId" TEXT;

UPDATE "Customer"
SET "shopId" = '00000000-0000-0000-0000-000000000001';

ALTER TABLE "Customer"
ALTER COLUMN "shopId" SET NOT NULL;


-- =========================================================
-- 5. ADD SHOP ID TO SEQUENCES
-- =========================================================

ALTER TABLE "sequences"
ADD COLUMN "shopId" TEXT;

UPDATE "sequences"
SET "shopId" = '00000000-0000-0000-0000-000000000001';

ALTER TABLE "sequences"
ALTER COLUMN "shopId" SET NOT NULL;

ALTER TABLE "sequences"
DROP CONSTRAINT "sequences_pkey";

ALTER TABLE "sequences"
ADD CONSTRAINT "sequences_pkey"
PRIMARY KEY ("id", "shopId");

CREATE INDEX "sequences_shopId_idx"
ON "sequences"("shopId");


-- =========================================================
-- 6. UPDATE OTP TABLE
-- =========================================================

ALTER TABLE "otps"
DROP CONSTRAINT "otps_pkey";

ALTER TABLE "otps"
ADD COLUMN "id" TEXT;

ALTER TABLE "otps"
ADD COLUMN "shopId" TEXT;

UPDATE "otps"
SET
    "id" = gen_random_uuid()::text,
    "shopId" = '00000000-0000-0000-0000-000000000001';

ALTER TABLE "otps"
ALTER COLUMN "id" SET NOT NULL;

ALTER TABLE "otps"
ALTER COLUMN "shopId" SET NOT NULL;

ALTER TABLE "otps"
ADD CONSTRAINT "otps_pkey"
PRIMARY KEY ("id");

CREATE INDEX "otps_shopId_idx"
ON "otps"("shopId");

CREATE INDEX "otps_phone_idx"
ON "otps"("phone");

CREATE UNIQUE INDEX "otps_shopId_phone_key"
ON "otps"("shopId", "phone");


-- =========================================================
-- 7. REMOVE OLD USER ROLE
-- =========================================================

ALTER TABLE "users"
DROP COLUMN "role";


-- =========================================================
-- 8. FOREIGN KEYS
-- =========================================================

ALTER TABLE "shop_users"
ADD CONSTRAINT "shop_users_shopId_fkey"
FOREIGN KEY ("shopId")
REFERENCES "shops"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "shop_users"
ADD CONSTRAINT "shop_users_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "users"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "otps"
ADD CONSTRAINT "otps_shopId_fkey"
FOREIGN KEY ("shopId")
REFERENCES "shops"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "Customer"
ADD CONSTRAINT "Customer_shopId_fkey"
FOREIGN KEY ("shopId")
REFERENCES "shops"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "Customer"
ADD CONSTRAINT "Customer_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "sequences"
ADD CONSTRAINT "sequences_shopId_fkey"
FOREIGN KEY ("shopId")
REFERENCES "shops"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
