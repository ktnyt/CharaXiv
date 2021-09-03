package lamp

import "cloud.google.com/go/firestore"

type Table struct {
	cr *firestore.CollectionRef
}

func (table Table) Doc(key string) *firestore.DocumentRef {
	return table.cr.Doc(key)
}

func (table Table) Query(stmts ...Statement) Query {
	return Query{Compose(stmts...).apply(table.cr.Query)}
}
