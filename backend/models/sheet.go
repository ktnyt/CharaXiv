package models

import (
	"errors"

	"github.com/ktnyt/charaxiv/backend/internal/lamp"
)

const SheetTableName = "sheets"

type Sheet struct {
	SheetID string      `firestore:"-" json:"id"`
	System  string      `firestore:"system" json:"system"`
	Owner   string      `firestore:"owner" json:"-"`
	Own     bool        `firestore:"-" json:"own"`
	Name    string      `firestore:"name" json:"name"`
	Ruby    string      `firestore:"ruby" json:"ruby"`
	Tags    []string    `firestore:"tags" json:"tags"`
	Memo    interface{} `firestore:"memo" json:"memo"`
	Data    interface{} `firestore:"data" json:"data"`
	Images  []string    `firestore:"images" json:"images"`
}

func NewSheet(system, owner string) Sheet {
	return Sheet{
		System: system,
		Owner:  owner,
		Tags:   []string{},
		Data:   map[string]string{},
		Images: []string{},
	}
}

func (sheet *Sheet) FillEmpty(sheetId string) error {
	sheet.SheetID = sheetId
	if sheet.System == "" {
		return errors.New("system is not set")
	}
	if sheet.Owner == "" {
		return errors.New("owner is not set")
	}
	if sheet.Tags == nil {
		sheet.Tags = []string{}
	}
	if sheet.Data == nil {
		sheet.Data = map[string]string{}
	}
	if sheet.Images == nil {
		sheet.Images = []string{}
	}
	return nil
}

type SheetPatcher struct {
	Name *string     `json:"name"`
	Ruby *string     `json:"ruby"`
	Tags []string    `json:"tags"`
	Memo interface{} `json:"memo"`
	Data interface{} `json:"data"`
}

func (patch SheetPatcher) Patches() (patches []lamp.Patch) {
	if patch.Name != nil {
		name := *(patch.Name)
		patches = append(patches, lamp.Patch{Key: "name", Value: name})
	}
	if patch.Ruby != nil {
		ruby := *(patch.Ruby)
		patches = append(patches, lamp.Patch{Key: "ruby", Value: ruby})
	}
	if patch.Tags != nil {
		patches = append(patches, lamp.Patch{Key: "tags", Value: patch.Tags})
	}
	if patch.Memo != nil {
		memo := patch.Memo
		patches = append(patches, lamp.Patch{Key: "memo", Value: memo})
	}
	if patch.Data != nil {
		patches = append(patches, lamp.JsonPatch(patch.Data, []string{"data"})...)
	}
	return patches
}

type SheetImagePatcher []string

func (patch SheetImagePatcher) Patches() []lamp.Patch {
	return []lamp.Patch{{Key: "images", Value: []string(patch)}}
}
