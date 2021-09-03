package lamp

import "cloud.google.com/go/firestore"

type Query struct {
	q firestore.Query
}

type Statement interface {
	apply(q firestore.Query) firestore.Query
}

type Statements []Statement

func (stmts Statements) apply(q firestore.Query) firestore.Query {
	for _, stmt := range stmts {
		q = stmt.apply(q)
	}
	return q
}

func (stmts *Statements) Add(q Statement) {
	*stmts = append(*stmts, q)
}

func Compose(stmts ...Statement) Statement {
	return Statements(stmts)
}

type WhereStatement struct {
	path  string
	op    string
	value interface{}
}

func (where *WhereStatement) apply(q firestore.Query) firestore.Query {
	return q.Where(where.path, where.op, where.value)
}

type WhereStatementBuilder string

func (builder WhereStatementBuilder) build(op string, value interface{}) *WhereStatement {
	return &WhereStatement{string(builder), op, value}
}

func (builder WhereStatementBuilder) Is(value interface{}) *WhereStatement {
	return builder.build("==", value)
}

func (builder WhereStatementBuilder) Not(value interface{}) *WhereStatement {
	return builder.build("!=", value)
}

func (builder WhereStatementBuilder) Lt(value interface{}) *WhereStatement {
	return builder.build("<", value)
}

func (builder WhereStatementBuilder) Le(value interface{}) *WhereStatement {
	return builder.build("<=", value)
}

func (builder WhereStatementBuilder) Gt(value interface{}) *WhereStatement {
	return builder.build(">", value)
}

func (builder WhereStatementBuilder) Ge(value interface{}) *WhereStatement {
	return builder.build(">=", value)
}

func (builder WhereStatementBuilder) Has(value interface{}) *WhereStatement {
	return builder.build("array-contains", value)
}

func (builder WhereStatementBuilder) Any(value interface{}) *WhereStatement {
	return builder.build("array-contains-any", value)
}

func (builder WhereStatementBuilder) In(value interface{}) *WhereStatement {
	return builder.build("in", value)
}

func (builder WhereStatementBuilder) None(value interface{}) *WhereStatement {
	return builder.build("not-in", value)
}

func Where(path string) WhereStatementBuilder {
	return WhereStatementBuilder(path)
}

var WhereID = Where(firestore.DocumentID)

type Limit int

func (limit Limit) apply(q firestore.Query) firestore.Query {
	return q.Limit(int(limit))
}

type Offset int

func (offset Offset) apply(q firestore.Query) firestore.Query {
	return q.Offset(int(offset))
}

type OrderByStatement struct {
	path string
	rev  bool
}

func (orderBy *OrderByStatement) apply(q firestore.Query) firestore.Query {
	dir := firestore.Desc
	if orderBy.rev {
		dir = firestore.Asc
	}
	return q.OrderBy(orderBy.path, dir)
}

func (orderBy *OrderByStatement) Reverse() *OrderByStatement {
	return &OrderByStatement{orderBy.path, !orderBy.rev}
}

func OrderBy(path string) *OrderByStatement {
	return &OrderByStatement{path, false}
}

var OrderByID = OrderBy(firestore.DocumentID)
