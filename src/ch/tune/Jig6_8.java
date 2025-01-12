package ch.tune;

public class Jig6_8 extends Jig {

	@Override
	public int getNumberOfForms() {
		return 2;
	}

	@Override
	public String getMeasure() {
		return "6/8";
	}

	@Override
	public boolean doRepeatParts() {
		return true;
	}
	
	@Override
	public String getName(){
		return "6_8-"+super.getName();
	}
}