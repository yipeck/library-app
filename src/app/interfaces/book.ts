export interface Book {
	Id:           number;
	ISBN:         string;
	AuthorId:     number;
	CategoryId:   number;
	PublisherId:  number;
	Title:        string;
	Picture:      string;
	PublishYear:  number;
	PublishMonth: number;
	ShopYear:     number;
	ShopMonth:    number;
	ShopDay:      number;
	ReadStatus:   string;
	Letter:       string;
	Created:      number;
};
