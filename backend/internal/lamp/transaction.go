package lamp

import (
	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Transaction struct {
	c  *Client
	tx *firestore.Transaction
}

func (t *Transaction) Get(table, key string, data interface{}) error {
	ref := t.c.Doc(table, key)
	snap, err := t.tx.Get(ref)
	if err == nil {
		err = snap.DataTo(&data)
	}
	if status.Code(err) == codes.NotFound {
		err = ErrNotFound
	}
	return err
}

func (t *Transaction) Set(table, key string, data interface{}) error {
	ref := t.c.Doc(table, key)
	return t.tx.Set(ref, data)
}

func (t *Transaction) Create(table, key string, data interface{}) error {
	return t.tx.Create(t.c.Doc(table, key), data)
}

func (t *Transaction) Update(table, key string, patches []Patch) error {
	updates := make([]firestore.Update, len(patches))
	for i, patch := range patches {
		updates[i] = firestore.Update{Path: patch.Key, Value: patch.Value}
	}
	ref := t.c.Doc(table, key)
	return t.tx.Update(ref, updates)
}

func (t *Transaction) Delete(table, key string, data interface{}) error {
	return t.tx.Delete(t.c.Doc(table, key))
}

type AssignFunc func(i int, data interface{}) error

func (t *Transaction) Query(query Query) ([]string, AssignFunc, error) {
	snaps, err := t.tx.Documents(query.q).GetAll()
	if err != nil {
		return nil, nil, err
	}
	ids := make([]string, len(snaps))
	for i, snap := range snaps {
		ids[i] = snap.Ref.ID
	}
	return ids, func(i int, data interface{}) error {
		return snaps[i].DataTo(data)
	}, nil
}
