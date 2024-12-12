/**
 * @swagger
 * components:
 *   schemas:
 *     EntryPayload:
 *       type: object
 *       required:
 *         - repositoryUrl
 *         - emails
 *       properties:
 *         repositoryUrl:
 *           type: string
 *           description: The URL of the repository
 *         emails:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of email addresses
 *       example:
 *         repositoryUrl: 'https://github.com/ayberkdikcinar/endower'
 *         emails: ['ayberkdikcinar@gmail.com']
 *     Entry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the entry
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the entry was created
 *         owner:
 *           type: string
 *           description: The owner of the repository
 *         platform:
 *           type: string
 *           description: The platform of the repository (e.g., github, gitlab)
 *         repo:
 *           type: string
 *           description: The name of the repository
 *         emails:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of email addresses
 *       example:
 *         id: 'generated-id'
 *         createdAt: '2023-10-01T00:00:00.000Z'
 *         owner: 'test-owner'
 *         platform: 'github'
 *         repo: 'test-repo'
 *         emails: ['test@example.com']
 *     DetailedVersionCheckResult:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the package
 *         version:
 *           type: string
 *           description: The current version of the package
 *         registry:
 *           type: string
 *           description: The registry of the package (e.g., npm, packagist)
 *         latestVersion:
 *           type: string
 *           description: The latest available version of the package
 *         upToDate:
 *           type: boolean
 *           description: Whether the package is up to date
 *       example:
 *         name: 'test-package'
 *         version: '1.0.0'
 *         registry: 'npm'
 *         latestVersion: '2.0.0'
 *         upToDate: false
 */

/**
 * @swagger
 * tags:
 *   name: Entries
 *   description: The entries managing API
 */

/**
 * @swagger
 * /entries:
 *   post:
 *     summary: Adds a new entry, returns the outdated packages instantly. Sets a job to check and email for outdated packages daily.
 *     tags: [Entries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EntryPayload'
 *     responses:
 *       200:
 *         description: The list of outdated packages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DetailedVersionCheckResult'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
