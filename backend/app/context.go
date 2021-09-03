package app

import (
	"context"
	"time"
)

type AppContextKey string

var (
	UsernameContextKey    AppContextKey = "username"
	AccessTokenContextKey AppContextKey = "access_token"
	CurrentTimeContextKey AppContextKey = "current_time"
)

func WithUsername(ctx context.Context, username string) context.Context {
	return context.WithValue(ctx, UsernameContextKey, username)
}

func WithAccessToken(ctx context.Context, access_token string) context.Context {
	return context.WithValue(ctx, AccessTokenContextKey, access_token)
}

func WithTime(ctx context.Context, t time.Time) context.Context {
	return context.WithValue(ctx, CurrentTimeContextKey, t)
}

func UseUsername(ctx context.Context) (string, bool) {
	value, ok := ctx.Value(UsernameContextKey).(string)
	return value, ok
}

func UseAccessToken(ctx context.Context) (string, bool) {
	value, ok := ctx.Value(AccessTokenContextKey).(string)
	return value, ok
}

func UseTime(ctx context.Context) time.Time {
	value, ok := ctx.Value(CurrentTimeContextKey).(time.Time)
	if !ok {
		value = time.Now()
	}
	return value
}
