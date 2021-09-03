package lamp

import (
	"context"
	"errors"

	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var ErrNotFound = errors.New("lamp: not found")

type Client struct {
	fc *firestore.Client
}

func Connect(ctx context.Context, name string) (*Client, error) {
	client, err := firestore.NewClient(ctx, name)
	if err != nil {
		return nil, err
	}
	return &Client{client}, nil
}

func (c *Client) Firestore() *firestore.Client {
	return c.fc
}

func (c *Client) Close() error {
	return c.fc.Close()
}

func (c *Client) RunTransaction(ctx context.Context, f func(context.Context, *Transaction) error) error {
	return c.fc.RunTransaction(ctx, func(ctx context.Context, ftx *firestore.Transaction) error {
		return f(ctx, &Transaction{c, ftx})
	})
}

func (c *Client) Table(table string) Table {
	return Table{c.fc.Collection(table)}
}

func (c *Client) Doc(table, key string) *firestore.DocumentRef {
	return c.Table(table).Doc(key)
}

func (c *Client) Exists(ctx context.Context, table, key string) (bool, error) {
	snap, err := c.Doc(table, key).Get(ctx)
	if err == nil {
		return snap.Exists(), nil
	}
	if status.Code(err) == codes.NotFound {
		return false, nil
	}
	return false, err
}

func (c *Client) Get(ctx context.Context, table, key string, data interface{}) error {
	snap, err := c.Doc(table, key).Get(ctx)
	if err == nil {
		err = snap.DataTo(&data)
	}
	if status.Code(err) == codes.NotFound {
		err = ErrNotFound
	}
	return err
}

func (c *Client) Set(ctx context.Context, table, key string, data interface{}) error {
	_, err := c.Doc(table, key).Set(ctx, data)
	return err
}

func (c *Client) Create(ctx context.Context, table, key string, data interface{}) error {
	_, err := c.Doc(table, key).Create(ctx, data)
	return err
}

func (c *Client) Update(ctx context.Context, table, key string, patches []Patch) error {
	updates := make([]firestore.Update, len(patches))
	for i, patch := range patches {
		updates[i] = firestore.Update{Path: patch.Key, Value: patch.Value}
	}
	_, err := c.Doc(table, key).Update(ctx, updates)
	return err
}

func (c *Client) Delete(ctx context.Context, table, key string) error {
	_, err := c.Doc(table, key).Delete(ctx)
	if status.Code(err) == codes.NotFound {
		err = ErrNotFound
	}
	return err
}

func (c *Client) WithContext(ctx context.Context) ContextClient {
	return ContextClient{c, ctx}
}

type ContextClient struct {
	c   *Client
	ctx context.Context
}

func (c ContextClient) Firestore() *firestore.Client {
	return c.c.Firestore()
}

func (c ContextClient) RunTransaction(f func(context.Context, *Transaction) error) error {
	return c.c.RunTransaction(c.ctx, f)
}

func (c ContextClient) Table(table string) Table {
	return c.c.Table(table)
}

func (c ContextClient) Doc(table, key string) *firestore.DocumentRef {
	return c.c.Doc(table, key)
}

func (c ContextClient) Exists(table, key string) (bool, error) {
	return c.c.Exists(c.ctx, table, key)
}

func (c ContextClient) Get(table, key string, data interface{}) error {
	return c.c.Get(c.ctx, table, key, data)
}

func (c ContextClient) Set(table, key string, data interface{}) error {
	return c.c.Set(c.ctx, table, key, data)
}

func (c ContextClient) Create(table, key string, data interface{}) error {
	return c.c.Create(c.ctx, table, key, data)
}

func (c ContextClient) Update(table, key string, patches []Patch) error {
	return c.c.Update(c.ctx, table, key, patches)
}

func (c ContextClient) Delete(table, key string) error {
	doc := c.Doc(table, key)
	_, err := doc.Delete(c.ctx)
	if status.Code(err) == codes.NotFound {
		err = ErrNotFound
	}
	return err
}
