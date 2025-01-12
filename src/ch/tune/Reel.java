package ch.tune;

public abstract class Reel extends TuneBase {


	@Override
	public String getName() {
		return "Reel";
	}

	@Override
	public String getRhytm() {
		return "Reel";
	}

	@Override
	public String getTempo() {
		return "1/2=110";
	}

	@Override
	public boolean doRepeatParts() {
		return false;
	}

	@Override
	public String getMeasure() {
		return "2/2";
	}

}
