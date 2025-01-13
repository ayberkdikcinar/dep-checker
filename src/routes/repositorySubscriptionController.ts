import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/http';
import { RepositorySubscriptionPayload } from '../types';
import { parseRepositoryUrl } from '../utils/parseRepositoryUrl';
import { ErrorMessage } from '../constants/messages';
import { RepositorySubscriptionService } from '../services/repositorySubscriptionService';
import { DeprecatedPackageFinderService } from '../services/deprecatedPackageFinderService';
import { PlatformError } from '../errors/domain';
import { appConfig } from '../config/appConfig';

async function processRepositorySubscription(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const repositorySubscriptionService = new RepositorySubscriptionService();
    const { repositoryUrl, emails } = req.body;

    const parsedUrl = parseRepositoryUrl(repositoryUrl);

    if (!parsedUrl) {
      throw new BadRequestError(ErrorMessage.InvalidRepositoryUrl);
    }

    const { owner, platform, repo } = parsedUrl;

    if (!appConfig.supportedPlatforms.includes(platform)) {
      throw new BadRequestError(ErrorMessage.InvalidPlatform(platform));
    }

    const newRepositorySubscriptionPayload: RepositorySubscriptionPayload = {
      owner,
      platform,
      name: repo,
      emails,
    };

    await repositorySubscriptionService.createRepositorySubscription(
      newRepositorySubscriptionPayload,
    );

    const deprecatedPackageFinderService = new DeprecatedPackageFinderService();
    const deprecatedPackageResponse =
      await deprecatedPackageFinderService.findDeprecatedPackages({
        owner,
        platform,
        repo,
      });

    res.json(deprecatedPackageResponse);
    return;
  } catch (error) {
    if (error instanceof PlatformError) {
      // Convert domain error to HTTP error
      const platformError = new BadRequestError(error.message);
      next(platformError);
      return;
    }
    next(error);
  }
}

export { processRepositorySubscription };
