package sid

import (
	"encoding/binary"
	"time"

	"github.com/ktnyt/charaxiv/backend/internal/basek"
	"github.com/ktnyt/charaxiv/backend/internal/utils"
)

const base58 = basek.BaseK("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")

var offset = time.Unix(0, 0).AddDate(50, 0, 0).Unix()

func New() string {
	var sid [8]byte
	ts := uint32(time.Now().Unix() - offset)
	binary.BigEndian.PutUint32(sid[:], ts)
	copy(sid[4:], utils.NewToken(4))
	return base58.Encode(sid[:])
}
