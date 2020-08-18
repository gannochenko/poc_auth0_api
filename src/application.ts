import '@babel/polyfill';
import { logInfo } from '@gannochenko/etc';
import { useControllers } from '@gannochenko/express.mvc';
import helmet from 'helmet';
import express from 'express';
import process from 'process';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import { useErrorHandler } from './lib/error-handler';
import { useCORS } from './lib/cors';
import { useMetrics } from './lib/metrics';

import { useGraphQL } from './graphql/server';
import { controllers } from './controller';

(async () => {
    const app = express();

    const host = process.env.NETWORK__HOST || 'localhost';
    const port = process.env.PORT || process.env.NETWORK__PORT || 4000;

    app.set('host', host);
    app.set('port', port);

    await useCORS(app);
    useMetrics(app);

    app.use(helmet());
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        }),
    );

    // app.set('query parser', query => {
    //   return qs.parse(query, { allowPrototypes: false, depth: 10 });
    // });

    // Create middleware for checking the JWT
    const checkJwt = jwt({
        // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://gannochenko.eu.auth0.com/.well-known/jwks.json`,
        }),

        // Validate the audience and the issuer.
        audience: 'https://gannochenko.eu.auth0.com/api/v2/',
        issuer: `https://gannochenko.eu.auth0.com/`,
        algorithms: ['RS256'],
    });

    app.get('/secret/government/agents', checkJwt, (req, res) => {
        console.log(req);

        res.status(200).send({
            data: {
                agents: [
                    { firstName: 'Jason', lastName: 'Bourne' },
                    { firstName: 'James', lastName: 'Bond' },
                ],
            },
        });
    });

    useControllers(app, controllers, async () => ({}));
    useGraphQL(app, {}, async () => ({}));

    useErrorHandler(app);

    const server = app.listen({ port }, () => {
        logInfo(`🚀 Auth0 API is ready at http://${host}:${port}`);
    });

    process.on('SIGTERM', () => {
        server.close((error) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }

            process.exit(0);
        });
    });
})();
