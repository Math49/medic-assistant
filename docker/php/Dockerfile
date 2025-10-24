FROM dunglas/frankenphp

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    git \
    unzip \
    librabbitmq-dev \
    libpq-dev \
    supervisor

RUN install-php-extensions \
	mongodb

COPY . /app

WORKDIR /app

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN cp .env.example .env

# ENV APP_ENV=production

RUN composer install --no-dev --optimize-autoloader

ENV DB_URI=$DATABASE_URI

ENV DB_DATABASE=$DATABASE_NAME

ENV APP_URL=$APP_URL

# RUN php artisan migrate

RUN php artisan key:generate

RUN php artisan config:cache

RUN php artisan route:cache

RUN php artisan view:cache

