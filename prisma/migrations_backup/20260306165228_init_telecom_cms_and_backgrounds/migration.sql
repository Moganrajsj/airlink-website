-- CreateTable
CREATE TABLE "BackgroundAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "animationType" TEXT NOT NULL,
    "speed" REAL NOT NULL DEFAULT 1.0,
    "opacity" REAL NOT NULL DEFAULT 0.2,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "speed" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "features" TEXT NOT NULL,
    "tag" TEXT,
    "isBusiness" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Coverage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "leadsCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "planId" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin'
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
