package basek

import (
	"math"
	"math/big"

	"github.com/ktnyt/reverse"
)

type BaseK string

type factor float64

func newFactor(k int) factor {
	return factor(8. / math.Log2(float64(k)))
}

func (f factor) Scale(n int) int {
	return int(math.Ceil(float64(f) * float64(n)))
}

type factors map[int]factor

func (ff factors) Get(k int) factor {
	f, ok := ff[k]
	if !ok {
		f = newFactor(k)
		ff[k] = f
	}
	return f
}

var knownFactors = make(factors)

var zero = big.NewInt(0)

func (alphabet BaseK) Encode(src []byte) string {
	x := new(big.Int)
	x.SetBytes(src)

	srclen := len(src)
	dstlen := knownFactors.Get(len(alphabet)).Scale(srclen)

	dst := make([]byte, 0, dstlen)

	radix := big.NewInt(int64(len(alphabet)))

	mod := new(big.Int)
	for x.Cmp(zero) > 0 {
		x.DivMod(x, radix, mod)
		dst = append(dst, alphabet[mod.Int64()])
	}

	for i := 0; i < srclen && src[i] == 0; i++ {
		dst = append(dst, alphabet[0])
	}

	for i := len(dst); len(dst) < dstlen; i++ {
		dst = append(dst, alphabet[0])
	}

	reverse.Bytes(dst)

	return string(dst)
}
