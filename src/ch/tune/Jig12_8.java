package ch.tune;

public class Jig12_8 extends Jig {

	@Override
	public int getNumberOfForms() {
		return 4;
	}

	@Override
	public String getMeasure() {
		return "12/8";
	}

	@Override
	public boolean doRepeatParts() {
		return false;
	}
	
	@Override
	public String getName(){
		return "12_8-"+super.getName();
	}
}